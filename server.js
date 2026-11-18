import app from './app.js'
import { connectDatabase } from './database/db.js'

const port = process.env.PORT || 5001

try {
  await connectDatabase()
} catch (error) {
  console.error('MongoDB connection failed:', error.message)
  process.exit(1)
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
