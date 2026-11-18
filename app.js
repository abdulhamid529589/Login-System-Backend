import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import ErrorHandler from './middlewares/errorMiddleware.js'
import authRouter from './router/authRoutes.js'
import protectedRouter from './router/protectedRoutes.js'

dotenv.config()

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts, try again later' },
})

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'OK' })
})

app.use('/api/v1/auth/login', loginLimiter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/protected', protectedRouter)

app.use((req, res, next) => {
  next(new ErrorHandler(`Cannot ${req.method} ${req.originalUrl}`, 404))
})

app.use(errorMiddleware)

export default app
