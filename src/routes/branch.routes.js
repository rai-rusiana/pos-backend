import * as branchController from "../controllers/branch.controller.js";
import { Router } from "express";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Protected routes (require a valid JWT)
// The user can only create a new branch for themselves
router.post(
  "/",
  authenticateToken,
  authorizeRole("ADMIN"),
  branchController.createBranch
);

// The user can get all branches they own
router.get("/", authenticateToken, authorizeRole(["ADMIN", "MANAGER"]), branchController.getOwnedBranches);

// The user can only get, update, or delete their OWN branch
router.get(
  "/:id",
  authenticateToken,
  authorizeRole(["ADMIN", "MANAGER"]),
  branchController.getBranchById
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("ADMIN"),
  branchController.updateBranch
);
router.delete("/:id", authenticateToken, authorizeRole('OWNER'), branchController.deleteBranch);

export default router;
