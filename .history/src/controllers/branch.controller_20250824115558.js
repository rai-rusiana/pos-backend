import * as branchService from "../services/branch.service.js";

/**
 * @description
 * Controller to create a new subject in the system.
 * 
 * This endpoint expects a logged-in professor (user) and extracts their user ID
 * from the request object. The subject details (className, classCode, schedule)
 * are taken from the request body.
 * 
 * The function calls the subject service to create a new subject associated with 
 * the professor. If successful, it responds with a 201 status code and a message
 * confirming creation, optionally returning the newly created subject object.
 * 
 * Error handling:
 * - Returns 403 if the user ID is missing (unauthorized access).
 * - Catches and logs any errors that occur during creation.
 *
 * @param {Request} req - Express request object, expecting `req.user?.userId` and `req.body` with subject data.
 * @param {Response} res - Express response object, used to send the result or error.
 * 
 * @example
 * POST /subjects
 * Body: { className: "Math 101", classCode: "M101", schedule: "MWF 9-10AM" }
 * Response: { message: "Subject successfully created", data: { id: 1, className: "Math 101", ... } }
 */

export const createBranch = async (req, res) => {
  const { name, address, phone } = req.body;

  if (!name || !address) {
    return res.status(400).json({
      error: "Missing required fields: name, address",
    });
  }
  const ownerId = req.user.userId;
  try {
    const newBrach = await branchService.createBranch(
      {
        name,
        address,
        phone,
      },
      ownerId
    );
    res.status(201).json(newBrach);
  } catch (error) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      // This check is specific to the branch model's unique constraints.
      if (target.includes("name")) {
        return res.status(409).json({
          error: "A branch with this name exists",
        });
      }
      return res.status(409).json({
        error: "A unique field already exists.",
      });
    }
    console.error("Error creating Branch:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const getBranchById = async (req, res) => {
  const { id } = req.params;
  try {
    const branch = await branchService.getBranchById(parseInt(id));
    if (!branch) {
      return res.status(404).json({
        error: "Branch not found.",
      });
    }
    res.status(200).json(branch);
  } catch (error) {
    console.error("Error getting branch:", error);
    res.status(500).json({
      error: "An internal server error has occured",
    });
  }
};

/**
 * @description
 * Retrieves all branches owned by the authenticated user.
 */
export const getOwnedBranches = async (req, res) => {
  const ownerId = req.user.userId;
  try {
    const branches = await branchService.getOwnedBranches(ownerId);
    res.status(200).json(branches);
  } catch (error) {
    console.error("Error getting owned branches", error);
    res.status(500).json({
      error: "An internal server error has occured.",
    });
  }
};

/**
 * @description
 * Updates an existing branch.
 */
export const updateBranch = async (req, res) => {
  const {id} = req.params;
  const { name, phone, address } = req.body;
  try {
    const updatedBranch = await branchService.updateBranch(parseInt(id), {
      name,
      address,
      phone,
    });
    res.status(200).json(updatedBranch);
  } catch (error) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      // This check is specific to the branch model's unique constraints.
      if (target.includes("name")) {
        return res.status(409).json({
          error: "A branch with this name exists",
        });
      }
      return res.status(409).json({
        error: "A unique field already exists.",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Branch not found",
      });
    }
    console.error("Error updating branch:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

/**
 * @description
 * Deletes a branch from the database.
 */
export const deleteBranch = async (req, res) => {
  const { id } = req.params;
  try {
    await branchService.deleteBranch(parseInt(id));
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Branch not found.",
      });
    }
    console.error("Error deleting branch", error);
    res.status(500).json({
      error: "An internal server error has occured",
    });
  }
};
