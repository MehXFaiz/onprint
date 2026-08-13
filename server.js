require('dotenv').config()

const createApp = require('./src/app')
const connectDB = require('./src/config/db')

const PORT = process.env.PORT || 5000
const MONGODB_ENABLED = process.env.MONGODB_ENABLED === 'true'

// Bind to the platform-assigned port immediately, independent of MongoDB.
// A slow/unreachable database must never delay or block port binding —
// deployment platforms detect the app as failed if nothing opens the
// assigned port within their startup window.
const app = createApp()
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ONPRINT API listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})

if (MONGODB_ENABLED && process.env.MONGODB_URI) {
  connectDB().catch((err) => {
    console.error('MongoDB connection failed:', err.message)
  })
} else {
  console.log('MongoDB connection disabled — set MONGODB_ENABLED=true and MONGODB_URI to enable.')
}
