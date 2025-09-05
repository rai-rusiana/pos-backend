import * as categoryService from "../services/category.service.js";

/**
 * @description
 * Creates a new category.
 */
export const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      error: "Missing required fields: name",
    });
  }
  try {
    const newCategory = await categoryService.createCategory(name);
    res.stats(201).json({
      newCategory,
    });
  } catch (error) {
    const target = error.meta?.target;
    // This check is specific to the branch model's unique constraints.
    if (target.includes("name")) {
      return res.status(409).json({
        error: "A category with this name exists",
      });
    }
    console.error("Error creating Branch:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = parseInt(req.params);
  try {
    const category = await categoryService.getCategoryById(parseInt(id));
     if (!category) {
          return res.status(400).json({
               error: "Category not found.",
          })
     }
    res.status(200).json({
      category,
    });
  } catch (error) {
    console.error("Error getting category:", error);
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
