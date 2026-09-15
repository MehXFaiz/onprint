process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception (safe to continue):', err.message)
  console.error(err.stack)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason?.message || reason)
})

require('dotenv').config()

const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const PORT = process.env.PORT || 5000
const CLIENT_DIST = path.join(__dirname, 'dist')

let app = null

async function ensureClientBuilt() {
  const indexPath = path.join(CLIENT_DIST, 'index.html')
  if (fs.existsSync(indexPath)) return true

  const isProd = process.env.NODE_ENV === 'production'
  console.log(`[Server] Client build not found at ${CLIENT_DIST}. Attempting production build...`)

  try {
    const clientDir = path.join(__dirname, 'client')
    if (!fs.existsSync(path.join(clientDir, 'node_modules'))) {
      console.log('[Server] Installing client dependencies first...')
      execSync('npm install --no-audit --no-fund', { cwd: clientDir, stdio: 'inherit', timeout: 5 * 60 * 1000 })
    }
    execSync(`npm run build${isProd ? ' --if-present' : ''}`, { cwd: __dirname, stdio: 'inherit', timeout: 10 * 60 * 1000 })
    console.log('[Server] Client build completed successfully.')
    return true
  } catch (err) {
    console.warn('[Server] Client build failed. Continuing in API-only mode. Error:', err.message)
    return false
  }
}

async function safeCreateApp() {
  try {
    const createApp = require('./src/app')
    return createApp()
  } catch (err) {
    console.error('[Server] Failed to create Express app:', err.message)
    console.error(err.stack)
    const express = require('express')
    const fallback = express()
    fallback.use(express.json())
    fallback.get('/api/health', (_req, res) => res.json({ success: true, degraded: true, message: 'ONPRINT running in degraded mode' }))
    fallback.use((_req, res) => res.status(503).json({ error: 'Service temporarily unavailable', degraded: true }))
    return fallback
  }
}

async function startServer() {
  await ensureClientBuilt().catch(() => {})

  try {
    const { testConnection } = require('./src/config/database')
    await testConnection()
  } catch (dbErr) {
    console.error('[Server] Database initialization note:', dbErr.message)
  }

  app = await safeCreateApp()

  try {
    const seoDailyScheduler = require('./src/services/seoDailyScheduler')
    seoDailyScheduler.init()
  } catch (err) {
    console.warn('[Server] Warning initializing SEO scheduler:', err.message)
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`ONPRINT API listening on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`)
  })

  server.on('error', (err) => {
    console.error('[Server] Server error:', err.message)
    if (err.code === 'EADDRINUSE') {
      console.error(`[Server] Port ${PORT} is already in use. Trying fallback port ${Number(PORT) + 1}...`)
      const fallbackServer = app.listen(Number(PORT) + 1, '0.0.0.0', () => {
        console.log(`ONPRINT API listening on fallback port ${Number(PORT) + 1}`)
      })
      fallbackServer.on('error', (fbErr) => console.error('[Server] Fallback server failed:', fbErr.message))
    }
  })
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error (binding port anyway with fallback):', err.message)
  try {
    const express = require('express')
    const lastResort = express()
    lastResort.get('/api/health', (_req, res) => res.json({ success: true, degraded: true, error: err.message }))
    lastResort.use((_req, res) => res.status(503).send(`<h1>ONPRINT - Starting Up</h1><p>${String(err.message)}</p>`))
    lastResort.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] Last-resort fallback bound to port ${PORT}`)
    })
  } catch (finalErr) {
    console.error('[Server] Completely failed to start:', finalErr.message)
    process.exit(1)
  }
})
