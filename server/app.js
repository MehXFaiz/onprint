const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { notFound, errorHandler } = require('./middleware/errorHandler')

function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    }),
  )
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  }

  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'ONPRINT API is running' })
  })

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = createApp
