import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import ErrorHandler from '../middlewares/errorMiddleware.js'
import { catchAsyncErrors } from '../middlewares/catchAsyncError.js'
import { sendToken } from '../utils/jwtToken.js'
import { sanitizeUser } from '../utils/sanitizeUser.js'

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return next(new ErrorHandler('Name, email and password are required', 400))
  }

  if (password.length < 8) {
    return next(new ErrorHandler('Password must be at least 8 characters', 400))
  }

  const exists = await User.findOne({ email: email.toLowerCase().trim() })
  if (exists) {
    return next(new ErrorHandler('Email is already registered', 409))
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  })

  sendToken(user, 201, 'Registered successfully', res)
})

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler('Email and password are required', 400))
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler('Invalid email or password', 401))
  }

  sendToken(user, 200, 'Logged in successfully', res)
})

export const getUser = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  })
})

export const logout = catchAsyncErrors(async (req, res) => {
  const options = {
    httpOnly: true,
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  }

  res
    .status(200)
    .cookie('accessToken', '', options)
    .cookie('refreshToken', '', options)
    .json({
      success: true,
      message: 'Logged out',
    })
})

export const refreshAccessToken = catchAsyncErrors(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!refreshToken) {
    return next(new ErrorHandler('Refresh token missing', 401))
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
  const user = await User.findById(decoded.id)

  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  sendToken(user, 200, 'Token refreshed', res)
})

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler('Old and new password are required', 400))
  }

  if (newPassword.length < 8) {
    return next(new ErrorHandler('New password must be at least 8 characters', 400))
  }

  const user = await User.findById(req.user._id).select('+password')

  if (!(await user.comparePassword(oldPassword))) {
    return next(new ErrorHandler('Old password is incorrect', 401))
  }

  user.password = newPassword
  await user.save()

  sendToken(user, 200, 'Password updated', res)
})
