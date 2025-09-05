// This file acts as the 'chef'. It handles requests and responses, calling the service layer for the business logic.

import * as userService from "../services/user.service.js";

/**
 * @description
 * Creates a new user.
 */
export const createUser = async (req, res) => {
  const { email, password, fullname, username, role } = req.body;

  // The condition here has been corrected to use '||' between all variables.
  if (!email || !password || !fullname || !username || !role) {
    return res.status(400).json({
      error:
        "Missing required fields: email, password, fullname, username, and role",
    });
  }

  try {
    const newUser = await userService.createUser({
      email,
      password,
      fullname,
      username,
      role,
    });
    res.status(201).json(newUser);
  } catch (error) {
    // We've also updated this block to give a more specific error for unique constraints.
    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (target.includes("email")) {
        return res
          .status(409)
          .json({ error: "A user with this email already exists." });
      }
      if (target.includes("username")) {
        return res
          .status(409)
          .json({ error: "A user with this username already exists." });
      }
      return res.status(409).json({
        error: "A unique field already exists.",
      });
    }
    console.error("Error creating user:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

// Note: This is a placeholder for your authentication middleware.
// You would replace this with actual logic to get the logged-in user's data.
// For example, from a JWT token payload.
const getAuthenticatedUser = (req) => {
  // Assuming req.user is set by your authentication middleware
  // with a shape like { id: 1, role: 'MANAGER' }
  return req.user;
};

/**
 * @description
 * Creates a new staff user. This function is restricted to ADMIN and MANAGER roles.
 * A MANAGER can only create other MANAGER or CASHIER roles, not ADMINs.
 */
export const createStaffUser = async (req, res) => {
  // Authenticate and get the current user from the request.
  const currentUser = getAuthenticatedUser(req);

  // Authorization check: Only ADMINs and MANAGERs can create new users.
  if (
    !currentUser ||
    (currentUser.role !== "ADMIN" && currentUser.role !== "MANAGER")
  ) {
    return res.status(403).json({
      error: "Forbidden: You do not have permission to create users.",
    });
  }

  // Input validation for the new user's data.
  const { fullname, username, email, password, role } = req.body;
  if (!fullname || !username || !email || !password || !role) {
    return res.status(400).json({
      error: "Missing required fields: fullname, user name, role, password",
    });
  }

  // Role-based creation check.
  // A MANAGER cannot create an ADMIN.
  if (currentUser.role === "MANAGER" && role === "ADMIN") {
    return res.status(403).json({
      error: "A Manager cannot create an Admin user.",
    });
  }
  console.log(currentUser.id)
  try {
    // Hash the password for security.


    // Prepare the new user data, including the managerId from the current user.
    const newUserData = {
      fullname,
      username,
      email,
      role,
      password,
      managerId: currentUser.id, // Link the new user to the manager/admin
    };

    // Call the service layer to create the user in the database.
    const newUser = await userService.createStaff(newUserData);

    // Omit the password hash from the response for security.
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    // Handle specific Prisma errors like unique constraint violations.
    if (error.code === "P2002") {
      // P2002 is Prisma's unique constraint violation error.
      // We check the target to provide a more specific error message.
      const target = error.meta?.target;
      if (target.includes("username")) {
        return res
          .status(409)
          .json({ error: "This username is already taken." });
      }
      if (target.includes("email")) {
        return res.status(409).json({ error: "This email is already in use." });
      }
    }
    // Log the full error for debugging purposes.
    console.error("Error creating staff user:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

/**
 * @description
 * Logs a user in and returns user details on success.
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await userService.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    // Authentication successful, return the user details (without the password)
    res.status(200).json(user);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};
/**
 * @description
 * Retrieves a list of all users
 */

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: "An internal server error occured.",
    });
  }
};
/**
 * @description
 * Retires a single user by their ID.
 */

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(parseInt(id));
    if (!user) {
      return res.status(404).json({
        error: "",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: "An internal server error has occured",
    });
  }
};

/**
 * @description
 * Uptdates an existing user's information
 */

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { email, password, fullname, username, role } = req.body;

  try {
    const updateUser = await userService.updateUser(parseInt(id), {
      email,
      password,
      fullname,
      username,
      role,
    });
    res.status(200).json(updateUser);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        errror: "User not found.",
      });
    }
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

/**
 * @description
 * Deletes a user from the database.
 */

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    await userService.deleteUser(parseInt(id));
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "User not found.",
      });
    }
    res.status(500).json({
      error: "An internal server error occured",
    });
  }
};
