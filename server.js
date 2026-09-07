require('dotenv').config()

const createApp = require('./src/app')
const { testConnection } = require('./src/config/database')
const seoDailyScheduler = require('./src/services/seoDailyScheduler')

const PORT = process.env.PORT || 5000

async function startServer() {
  await testConnection()
  const app = createApp()
  
  // Initialize AI SEO daily scheduler
  try {
    seoDailyScheduler.init()
  } catch (err) {
    console.warn('[Server] Warning initializing SEO scheduler:', err.message)
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ONPRINT API listening on port ${PORT}`)
  })
}

startServer()
