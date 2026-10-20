require('dotenv').config()

let app = null

function getApp() {
  if (!app) {
    try {
      const createApp = require('../src/app')
      app = createApp()
    } catch (err) {
      console.error('[Vercel Serverless] Failed to initialize Express app:', err)
      const express = require('express')
      const fallback = express()
      fallback.use(express.json())
      fallback.get(['/api/health', '/api/ping'], (req, res) => {
        res.status(200).json({ status: 'ok', fallback: true, message: 'Degraded mode', error: err.message })
      })
      fallback.all('*', (req, res) => {
        res.status(500).json({
          success: false,
          error: 'API initialization failed',
          message: err.message,
        })
      })
      app = fallback
    }
  }
  return app
}

module.exports = (req, res) => {
  return getApp()(req, res)
}
