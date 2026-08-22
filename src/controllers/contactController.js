const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')
const persistentStore = require('../data/persistentStore')

async function submitContact(req, res, next) {
  try {
    const { name, email, phone, company, subject, message } = req.body

    if (!name || !email || !message) {
      throw new ApiError(400, 'Name, email, and message are required fields')
    }

    const savedLocal = persistentStore.addMessage({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || null,
      company: company || null,
      subject: subject || 'Direct Studio Inquiry',
      message: message.trim(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    })

    let messageId = savedLocal.id

    try {
      const [result] = await pool.execute(
        'INSERT INTO contact_messages (name, email, phone, company, subject, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name.trim(), email.toLowerCase().trim(), phone || null, company || null, subject || 'Direct Studio Inquiry', message.trim(), 'unread']
      )
      if (result?.insertId) {
        messageId = result.insertId
      }
    } catch (err) {
      console.warn('[Contact Controller] MySQL insert fallback to persistent store:', err.message)
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our Dubai sales team will respond shortly.',
      data: {
        id: messageId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject || 'Direct Studio Inquiry',
        status: 'unread',
      },
    })
  } catch (err) {
    next(err)
  }
}

async function listContactMessages(req, res, next) {
  try {
    let messages = []
    let mysqlLoaded = false

    try {
      const [rows] = await pool.execute('SELECT * FROM contact_messages ORDER BY created_at DESC')
      if (rows.length > 0) {
        messages = rows.map((r) => ({
          _id: `msg-${r.id}`,
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          company: r.company,
          subject: r.subject || 'Direct Studio Inquiry',
          message: r.message,
          status: r.status || 'unread',
          createdAt: r.created_at,
        }))
        mysqlLoaded = true
      }
    } catch (err) {
      // MySQL unavailable
    }

    if (!mysqlLoaded || messages.length === 0) {
      messages = persistentStore.getMessages()
    }

    res.json({
      success: true,
      data: messages,
    })
  } catch (err) {
    next(err)
  }
}

async function updateContactMessageStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    persistentStore.updateMessageStatus(id, status)

    try {
      await pool.execute('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id])
    } catch {
      // offline
    }

    res.json({
      success: true,
      message: 'Message status updated successfully',
    })
  } catch (err) {
    next(err)
  }
}

async function deleteContactMessage(req, res, next) {
  try {
    const { id } = req.params

    persistentStore.deleteMessage(id)

    try {
      await pool.execute('DELETE FROM contact_messages WHERE id = ?', [id])
    } catch {
      // offline
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  submitContact,
  listContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
}
