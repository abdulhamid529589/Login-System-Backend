import { catchAsyncErrors } from '../middlewares/catchAsyncError.js'
import { sanitizeUser } from '../utils/sanitizeUser.js'

export const getProfile = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  })
})

export const getAdminData = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access granted',
    user: sanitizeUser(req.user),
  })
})
