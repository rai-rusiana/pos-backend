import * as storeService from "../services/store.services.js";
/**
 * @description
 * Creates a new store and assigns it to a branch.
 */
export const createStore = async (req, res) => {
  const {
    name,
    address,
    phone,
    code,
    governmentTax,
    serviceCharge,
    outletType,
  } = req.body;
  const { id } = req.params
  const branchId = parseInt(id)
  const ownerId = req.user.userId;
  if (!ownerId) {
    return res.status(401).json({
      error: "Unauthorized: User ID is missing from the authentication token.",
    });
  }
  if (!name || !address || !code || !outletType || !branchId) {
    return res.status(400).json({
      error:
        "Missing required fields: name, address, code, outletType, branchId",
    });
  }

  try {
    const newStore = await storeService.createStore(
      {
        name,
        address,
        phone,
        code,
        governmentTax,
        serviceCharge,
        outletType,
      },
      branchId,
      ownerId
    );
    res.status(201).json(newStore);
  } catch (error) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (target.includes("name")) {
        return res.status(409).json({
          error: "A store with this name exists",
        });
      }
      if (target.includes("code")) {
        return res.status(409).json({
          error: "A store with this code exists",
        });
      }
      return res.status(409).json({
        error: "A unique field already exists.",
      });
    }
    console.error("Error creating Store:", error);
    res.status(500).json({
      error: "Internal server error has occured.",
    });
  }
};

export const addStaffToStore = async (req, res) => {
  // Get the storeId from the URL parameters
  const { id } = req.params;
  // Get the userId AND the role from the request body
  const { userId, role } = req.body; 

  // Check for both userId AND role
  if (!userId || !role) {
    return res.status(400).json({ // Use 400 for a bad request (missing data)
      error: "Missing required fields: userId and role"
    });
  } 

  try {
    // Call the service with the correct parameters
    const staff = await storeService.addStaffToStore(parseInt(id), userId, role);
    // Send a 201 status for successful resource creation
    return res.status(201).json(staff); 
  } catch (error) {
    console.error(error); // Log the error for debugging
    // Return a more descriptive error message
    return res.status(500).json({
      error: "An unexpected error occurred while adding staff.",
    });
  }
};
/**
 * @description
 * Retrieves a single store by its ID.
 */
export const getStoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const store = await storeService.getStoreById(parseInt(id));
    if (!store) {
      return res.status(404).json({ error: "Store not found." });
    }
    res.status(200).json(store);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Store not found.",
      });
    }
    console.error("Error getting Store:", error);
    res.status(500).json({
      error: "An internal server has occured.",
    });
  }
};

/**
 * @description
 * Retrieves all stores belonging to a specific branch.
 */
export const getStoresByBranchId = async (req, res) => {
  const { id } = req.params;
  try {
    const stores = await storeService.getStoresByBranchId(parseInt(id));
    res.status(200).json(stores);
  } catch (error) {
    console.error("Error getting branch stores:", error);
    res.status(500).json({
      error: "An internal server error has occured",
    });
  }
};
/**
 * @description
 * Updates an existing store by its ID.
 */
export const updateStore = async (req, res) => {
  const { id } = req.params;
  const { ...storeData } = req.body;
  try {
    const updatedStore = await storeService.updateStore(parseInt(id), {
      ...storeData,
    });
    res.status(200).json(updatedStore);
  } catch (error) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (target.includes("name")) {
        return res.status(409).json({
          error: "A store with this name exists",
        });
      }
      if (target.includes("code")) {
        return res.status(409).json({
          error: "A store with this code exists",
        });
      }
      return res.status(409).json({
        error: "A unique field already exists.",
      });
    }
    console.error("Error updating branch:", error);
    res.status(500).json({
      error: "An internal server error has occured",
    });
  }
};
/**
 * @description
 * Deletes a store from the database.
 */
export const deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    await storeService.deleteStore(parseInt(id));
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Store not found.",
      });
    }
    console.error("Error deleting Store", error);
    res.status(500).json({
      error: "An internal server error has occured",
    });
  }
};
