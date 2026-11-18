import express from 'express'
import {
  getUser,
  login,
  logout,
  refreshAccessToken,
  register,
  updatePassword,
} from '../controllers/authController.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh-token', refreshAccessToken)
router.get('/me', isAuthenticated, getUser)
router.get('/logout', isAuthenticated, logout)
router.put('/password/update', isAuthenticated, updatePassword)

export default router
