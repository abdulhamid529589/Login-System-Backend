import express from 'express'
import { getAdminData, getProfile } from '../controllers/protectedController.js'
import { authorizeRoles, isAuthenticated } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/profile', isAuthenticated, getProfile)
router.get('/admin', isAuthenticated, authorizeRoles('admin'), getAdminData)

export default router
