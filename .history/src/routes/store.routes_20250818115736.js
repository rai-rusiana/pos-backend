import { Router } from 'express'
import * as storeController from '../controllers/store.controller.js'
import { authenticateToken, authorizeRole, authorizeUser } from '../middleware/auth.middleware.js'


const router = Router()

router.post("/branch/:id",
     authenticateToken,
     authorizeRole(['ADMIN', 'MANAGER']),
     authorizeUser('branch', 'id'),
     storeController.createStore
)

router.post("/:id",
     authenticateToken,
     authorizeRole(['ADMIN', 'MANAGER']),
     storeController.addStaffToStore
)

router.get("/:id/staffs",
     authenticateToken,
     authorizeRole(['ADMIN', 'MANAGER']),
     storeController.getStoreStaffs
)

router.get("/:id",
     authenticateToken,
     authorizeRole(['ADMIN', 'MANAGER']),
     storeController.getStoreById
)

router.get("/branch/:id",
     authenticateToken,
     authorizeRole(['ADMIN', 'MANAGER']),
     storeController.getStoresByBranchId
)


router.put("/:id",
     authenticateToken,
     authorizeRole(['ADMIN', 'MANAGER']),
     authorizeUser('store', 'id'),
     storeController.updateStore
)

router.delete("/:id",
     authenticateToken,
     authorizeRole('ADMIN'),
     authorizeUser('store', 'id'),
     storeController.deleteStore
)
export default router