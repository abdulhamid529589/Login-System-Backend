import jwt from 'jsonwebtoken'
import { sanitizeUser } from './sanitizeUser.js'

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}

export const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  })
}

export const createRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  })
}

export const sendToken = (user, statusCode, message, res) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'JWT secrets are not configured',
    })
  }

  const accessToken = createAccessToken(user._id)
  const refreshToken = createRefreshToken(user._id)

  res
    .status(statusCode)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      message,
      user: sanitizeUser(user),
      accessToken,
    })
}
