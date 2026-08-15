const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { notFound, errorHandler } = require('./middleware/errorHandler')
const categoryRoutes = require('./routes/categoryRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const productRoutes = require('./routes/productRoutes')

const CLIENT_DIST = path.join(__dirname, '..', 'dist')

function createApp() {
  const app = express()

  app.use(
    helmet({
      // the client bundle is served from this same process in production, so it
      // needs a relaxed CSP rather than helmet's API-oriented default
      contentSecurityPolicy: false,
    }),
  )
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

  app.use('/assets', express.static(path.join(__dirname, 'assets')))
  app.use('/assets', express.static(path.join(__dirname, '..', 'client', 'public', 'assets')))

  app.use('/api/categories', categoryRoutes)
  app.use('/api/services', serviceRoutes)
  app.use('/api/products', productRoutes)

  // Single-process deployment: if a built client exists (npm run build --prefix
  // client), serve it from the same Express process/port instead of requiring a
  // separate static-site host. Required on platforms (cPanel Node.js Apps
  // included) that only allow one process bound to one assigned port.
  const hasClientBuild = fs.existsSync(path.join(CLIENT_DIST, 'index.html'))
  if (process.env.NODE_ENV === 'production' && hasClientBuild) {
    app.use(express.static(CLIENT_DIST))
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.join(CLIENT_DIST, 'index.html'))
    })
  }

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = createApp
