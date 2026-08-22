require('dotenv').config()

const createApp = require('./src/app')
const { testConnection } = require('./src/config/database')

const PORT = process.env.PORT || 5000

async function startServer() {
  await testConnection()
  const app = createApp()
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ONPRINT API listening on port ${PORT}`)
  })
}

startServer()
