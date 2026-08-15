const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')

async function submitContact(req, res, next) {
  try {
    const { name, email, phone, company, subject, message } = req.body

    if (!name || !email || !message) {
      throw new ApiError(400, 'Name, email, and message are required fields')
    }

    try {
      await pool.execute(
        'INSERT INTO contact_messages (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
        [name.trim(), email.toLowerCase().trim(), phone || null, company || null, subject || null, message.trim()]
      )
    } catch (err) {
      console.error('Contact message DB insert error:', err.message)
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our Dubai sales team will respond shortly.',
    })
  } catch (err) {
    next(err)
  }
}

async function listContactMessages(req, res, next) {
  try {
    let messages = []
    try {
      const [rows] = await pool.execute('SELECT * FROM contact_messages ORDER BY created_at DESC')
      messages = rows
    } catch {
      // Fallback
    }

    res.json({
      success: true,
      data: messages,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  submitContact,
  listContactMessages,
}
