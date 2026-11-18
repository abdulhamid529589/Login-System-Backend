import jwt from 'jsonwebtoken'
import { catchAsyncErrors } from './catchAsyncError.js'
import ErrorHandler from './errorMiddleware.js'
import User from '../models/userModel.js'

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies?.accessToken

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new ErrorHandler('Please login first', 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return next(new ErrorHandler('User not found', 401))
    }

    req.user = user
    next()
  } catch (error) {
    return next(new ErrorHandler('Invalid or expired token', 401))
  }
})

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler('You are not allowed to access this route', 403))
    }
    next()
  }
}
