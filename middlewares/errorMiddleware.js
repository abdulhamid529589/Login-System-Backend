class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  if (err.code === 11000) {
    statusCode = 409
    message = 'Email is already registered'
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Invalid or expired token'
  }

  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID'
  }

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ')
  }

  res.status(statusCode).json({
    success: false,
    message,
  })
}

export default ErrorHandler
