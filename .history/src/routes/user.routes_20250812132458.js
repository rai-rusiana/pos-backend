// Use the new user router for all endpoints starting with /api/users
// This file acts as the 'menu' for the user endpoints. It defines the routes and points them to the correct controller functions.

import * as userController from '../controllers/user.controller.js'
import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js'

const router = Router();

// Public routes
// Log in a user
router.post('/login', userController.loginUser)
// Create a new user
router.post('/', userController.createUser)


// Protected routes (require a valid JWT)
// We add 'authenticateToken' before the controller function
// Get all users
router.get('/',authenticateToken, userController.getAllUsers)

// Get a single User
router.get('/:id',authenticateToken, userController.getUserById)

// Update a user by id
router.put('/:id',authenticateToken,authorizeRole(['MANAGER', 'ADMIN']), userController.updateUserById)

// Delete a User by Id
router.delete('/:id',authenticateToken,authorizeRole(['MANAGER', 'ADMIN']), userController.deleteUserById)

export default router