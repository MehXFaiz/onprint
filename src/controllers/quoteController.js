const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')

async function createQuote(req, res, next) {
  const connection = await pool.getConnection()
  try {
    const { name, email, phone, company, notes, items, totalPrice } = req.body

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required to request a quote')
    }

    await connection.beginTransaction()

    // Generate unique quote number: QT-YEAR-RANDOM
    const year = new Date().getFullYear()
    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const quoteNumber = `QT-${year}-${randomSeq}`

    const userId = req.user ? req.user.id : null

    const [result] = await connection.execute(
      `INSERT INTO quotes 
        (quote_number, user_id, name, email, phone, company, notes, status, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        quoteNumber,
        userId,
        name.trim(),
        email.toLowerCase().trim(),
        phone || null,
        company || null,
        notes || null,
        totalPrice || 0.0,
      ]
    )

    const quoteId = result.insertId

    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await connection.execute(
          `INSERT INTO quote_items 
            (quote_id, product_id, product_name, quantity, unit_price, subtotal, options)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            quoteId,
            item.productId || null,
            item.productName || item.name || 'Custom Print Job',
            item.quantity || 1,
            item.unitPrice || item.price || 0.0,
            item.subtotal || (item.quantity || 1) * (item.unitPrice || item.price || 0.0),
            item.options ? JSON.stringify(item.options) : null,
          ]
        )
      }
    }

    await connection.commit()

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data: {
        id: quoteId,
        quoteNumber,
        status: 'Pending',
      },
    })
  } catch (err) {
    await connection.rollback()
    next(err)
  } finally {
    connection.release()
  }
}

async function listQuotes(req, res, next) {
  try {
    let quotes = []
    try {
      let query = 'SELECT * FROM quotes ORDER BY created_at DESC'
      let params = []

      // If customer (non-admin), restrict to user's quotes
      if (req.user && req.user.role !== 'admin') {
        query = 'SELECT * FROM quotes WHERE user_id = ? OR email = ? ORDER BY created_at DESC'
        params = [req.user.id, req.user.email]
      }

      const [rows] = await pool.execute(query, params)

      if (rows.length > 0) {
        const [items] = await pool.execute('SELECT * FROM quote_items')

        const itemMap = {}
        items.forEach((item) => {
          if (!itemMap[item.quote_id]) itemMap[item.quote_id] = []
          itemMap[item.quote_id].push({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            quantity: item.quantity,
            unitPrice: Number(item.unit_price),
            subtotal: Number(item.subtotal),
            options: item.options ? (typeof item.options === 'string' ? JSON.parse(item.options) : item.options) : null,
          })
        })

        quotes = rows.map((q) => ({
          id: q.id,
          quoteNumber: q.quote_number,
          name: q.name,
          email: q.email,
          phone: q.phone,
          company: q.company,
          notes: q.notes,
          status: q.status,
          totalPrice: Number(q.total_price),
          createdAt: q.created_at,
          items: itemMap[q.id] || [],
        }))
      }
    } catch {
      // Fallback
    }

    res.json({
      success: true,
      data: quotes,
    })
  } catch (err) {
    next(err)
  }
}

async function getQuoteById(req, res, next) {
  try {
    const { id } = req.params

    const [rows] = await pool.execute('SELECT * FROM quotes WHERE id = ? OR quote_number = ? LIMIT 1', [id, id])

    if (rows.length === 0) {
      throw new ApiError(404, 'Quote not found')
    }

    const q = rows[0]
    const [items] = await pool.execute('SELECT * FROM quote_items WHERE quote_id = ?', [q.id])

    res.json({
      success: true,
      data: {
        id: q.id,
        quoteNumber: q.quote_number,
        name: q.name,
        email: q.email,
        phone: q.phone,
        company: q.company,
        notes: q.notes,
        status: q.status,
        totalPrice: Number(q.total_price),
        createdAt: q.created_at,
        items: items.map((i) => ({
          id: i.id,
          productName: i.product_name,
          quantity: i.quantity,
          unitPrice: Number(i.unit_price),
          subtotal: Number(i.subtotal),
          options: i.options ? (typeof i.options === 'string' ? JSON.parse(i.options) : i.options) : null,
        })),
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createQuote,
  listQuotes,
  getQuoteById,
}
