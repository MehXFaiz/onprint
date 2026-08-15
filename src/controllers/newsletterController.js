const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')

async function subscribe(req, res, next) {
  try {
    const { email } = req.body

    if (!email || !email.includes('@')) {
      throw new ApiError(400, 'Valid email address is required')
    }

    const cleanEmail = email.toLowerCase().trim()

    try {
      await pool.execute(
        'INSERT INTO newsletter_subscribers (email, status) VALUES (?, "subscribed")',
        [cleanEmail]
      )
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        return res.json({
          success: true,
          message: 'Thank you! You are already subscribed to ONPRINT updates.',
        })
      }
      console.error('Newsletter subscribe error:', err.message)
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to ONPRINT offers and print news.',
    })
  } catch (err) {
    next(err)
  }
}

async function listSubscribers(req, res, next) {
  try {
    let subscribers = []
    try {
      const [rows] = await pool.execute('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC')
      subscribers = rows
    } catch {
      // Fallback
    }

    res.json({
      success: true,
      data: subscribers,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  subscribe,
  listSubscribers,
}
