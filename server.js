require('dotenv').config()

const createApp = require('./src/app')
const connectDB = require('./src/config/db')

const PORT = process.env.PORT || 5000
const mongoEnabled = process.env.MONGODB_ENABLED === 'true'

// Bind to the platform-assigned port immediately, independent of MongoDB.
const app = createApp()
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ONPRINT API listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})

if (mongoEnabled && process.env.MONGODB_URI) {
  connectDB().catch((err) => {
    console.error('MongoDB connection failed:', err.message)
  })
}
