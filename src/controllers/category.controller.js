// controllers/category.controller.js
// This file contains the controller functions for the Category model.
// It handles incoming HTTP requests and delegates the business logic to the service layer.

import * as categoryService from "../services/category.service.js";

/**
 * @description
 * Creates a new category.
 */
export const createCategory = async (req, res) => {
  const categories = req.body;

  try {
    if (Array.isArray(categories)) {
      if (categories.length === 0) {
        return res.status(400).json({
          error: "Request body must be a non-empty array of categories.",
        });
      }
      const newCategories = await categoryService.createCategories(categories);
      res.status(201).json(newCategories);
    } else {
     const { name } = categories;
      if (!name) {
        return res.status(400).json({
          error: "Missing required field: name.",
        });
      }
      // Await the service function call to create the new category.
      // Pass the name as an object for consistency with other methods.
      const newCategory = await categoryService.createCategory({ name });
      // Corrected the typo from 'res.stats' to 'res.status'
      res.status(201).json(newCategory);
    }
  } catch (error) {
    // Check for Prisma's unique constraint violation error code 'P2002'
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "A category with this name already exists.",
      });
    }
    // Corrected log message to be more specific to this controller
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
    // The response is already correct, no change needed.
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
  // Corrected parameter parsing. You need to access `req.params.id`
  const { id } = req.params;

  try {
    // Ensure the ID is parsed as an integer for the database query
    const category = await categoryService.getCategoryById(parseInt(id, 10));
    if (!category) {
      // Changed the status to 404 (Not Found) which is more appropriate
      return res.status(404).json({
        error: "Category not found.",
      });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error getting category:", error);
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
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({
      error: "Missing required fields: name",
    });
  }

  try {
    // Passing the name as an object for consistency with other create/update methods
    const updatedCategory = await categoryService.updateCategoryById(
      parseInt(id),
      { name }
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
 * Retrieves all items associated with a specific category.
 */
export const getItemsByCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // The service layer handles returning the items, or an empty array if none exist.
    const categoryItems = await categoryService.getItemsByCategoryId(
      parseInt(id, 10)
    );

    // Check for the scenario where the category itself doesn't exist
    // This assumes the service returns null if the category ID is not found.
    if (categoryItems === null) {
      return res.status(404).json({
        error: "Category not found.",
      });
    }

    // If the category exists but has no items, the service will return an empty array,
    // and this will correctly return a 200 OK with an empty array.
    res.status(200).json(categoryItems);
  } catch (error) {
    console.error("Error getting category items:", error);
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
    await categoryService.deleteCategory(parseInt(id, 10));
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
