const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')
const persistentStore = require('../data/persistentStore')

async function createQuote(req, res, next) {
  let connection = null
  try {
    const { name, email, phone, company, notes, items, totalPrice, specs, artworkFile, productName, quantity } = req.body

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required to request a quote')
    }

    const year = new Date().getFullYear()
    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const quoteNumber = `QT-${year}-${randomSeq}`
    const userId = req.user ? req.user.id : null

    // 1. Always persist to disk-backed persistentStore
    const createdLocalQuote = persistentStore.addQuote({
      quoteNumber,
      userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || null,
      company: company || null,
      notes: notes || null,
      specs: specs || null,
      artworkFile: artworkFile || null,
      totalPrice: Number(totalPrice || 0),
      productName: productName || items?.[0]?.productName || 'Custom Print Job',
      quantity: quantity || items?.[0]?.quantity || 1,
      items: Array.isArray(items) ? items : [],
    })

    let quoteId = createdLocalQuote.id

    // 2. If MySQL is connected, insert into MySQL database
    try {
      connection = await pool.getConnection()
      await connection.beginTransaction()

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

      quoteId = result.insertId

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
    } catch (dbErr) {
      if (connection) await connection.rollback()
      console.warn('[Quote Controller] MySQL insert skipped, saved in persistent store:', dbErr.message)
    } finally {
      if (connection) connection.release()
    }

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
    next(err)
  }
}

async function listQuotes(req, res, next) {
  try {
    let quotes = []
    let mysqlLoaded = false

    try {
      let query = 'SELECT * FROM quotes ORDER BY created_at DESC'
      let params = []

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
          _id: `qt-${q.id}`,
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
          productName: itemMap[q.id]?.[0]?.productName || 'Custom Print Job',
          items: itemMap[q.id] || [],
        }))
        mysqlLoaded = true
      }
    } catch {
      // MySQL unavailable
    }

    if (!mysqlLoaded) {
      quotes = persistentStore.getQuotes()
      if (req.user && req.user.role !== 'admin') {
        quotes = quotes.filter((q) => q.userId === req.user.id || (q.email && q.email.toLowerCase() === req.user.email?.toLowerCase()))
      }
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

    try {
      const [rows] = await pool.execute('SELECT * FROM quotes WHERE id = ? OR quote_number = ? LIMIT 1', [id, id])

      if (rows.length > 0) {
        const q = rows[0]
        const [items] = await pool.execute('SELECT * FROM quote_items WHERE quote_id = ?', [q.id])

        return res.json({
          success: true,
          data: {
            _id: `qt-${q.id}`,
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
      }
    } catch {
      // MySQL unavailable
    }

    const localQuote = persistentStore.getQuote(id)
    if (localQuote) {
      return res.json({
        success: true,
        data: localQuote,
      })
    }

    throw new ApiError(404, 'Quote not found')
  } catch (err) {
    next(err)
  }
}

async function updateQuoteStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) throw new ApiError(400, 'Status is required')

    const updated = persistentStore.updateQuoteStatus(id, status)

    try {
      await pool.execute(
        'UPDATE quotes SET status = ?, updated_at = NOW() WHERE id = ? OR quote_number = ?',
        [status, id, id]
      )

      if (status === 'Approved') {
        const [rows] = await pool.execute(
          'SELECT * FROM quotes WHERE id = ? OR quote_number = ? LIMIT 1',
          [id, id]
        )
        if (rows.length > 0) {
          const q = rows[0]
          const [existingOrders] = await pool.execute(
            'SELECT id FROM orders WHERE notes LIKE ? LIMIT 1',
            [`%${q.quote_number}%`]
          )
          if (existingOrders.length === 0) {
            const year = new Date().getFullYear()
            const randomSeq = Math.floor(100000 + Math.random() * 900000)
            const orderNumber = `ONP-${year}-${randomSeq}`
            const [orderRes] = await pool.execute(
              `INSERT INTO orders 
                (order_number, user_id, customer_name, customer_email, customer_phone, company, status, subtotal, tax, shipping, total_price, currency, notes)
               VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, 0, 0, ?, 'AED', ?)`,
              [
                orderNumber,
                q.user_id || null,
                q.name,
                q.email,
                q.phone || null,
                q.company || null,
                q.total_price || 0,
                q.total_price || 0,
                q.notes ? `${q.notes} (Approved Quote ${q.quote_number})` : `Approved Quote ${q.quote_number}`,
              ]
            )

            const [items] = await pool.execute('SELECT * FROM quote_items WHERE quote_id = ?', [q.id])
            if (items.length > 0) {
              for (const item of items) {
                await pool.execute(
                  `INSERT INTO order_items 
                    (order_id, product_id, product_name, quantity, unit_price, subtotal)
                   VALUES (?, ?, ?, ?, ?, ?)`,
                  [
                    orderRes.insertId,
                    item.product_id || null,
                    item.product_name || 'Custom Print Job',
                    item.quantity || 1,
                    item.unit_price || 0,
                    item.subtotal || 0,
                  ]
                )
              }
            } else {
              await pool.execute(
                `INSERT INTO order_items 
                  (order_id, product_id, product_name, quantity, unit_price, subtotal)
                 VALUES (?, NULL, 'Custom Print Job', 1, ?, ?)`,
                [orderRes.insertId, q.total_price || 0, q.total_price || 0]
              )
            }
          }
        }
      }
    } catch {
      // MySQL unavailable
    }

    res.json({
      success: true,
      message: `Quote status updated to ${status}${status === 'Approved' ? ' and converted to order' : ''}`,
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

async function updateQuote(req, res, next) {
  try {
    const { id } = req.params
    const updatedFields = req.body

    const updated = persistentStore.updateQuote(id, updatedFields)

    try {
      const { name, email, phone, company, notes, status, totalPrice } = updatedFields
      await pool.execute(
        `UPDATE quotes 
         SET name = COALESCE(?, name),
             email = COALESCE(?, email),
             phone = COALESCE(?, phone),
             company = COALESCE(?, company),
             notes = COALESCE(?, notes),
             status = COALESCE(?, status),
             total_price = COALESCE(?, total_price),
             updated_at = NOW()
         WHERE id = ? OR quote_number = ?`,
        [name, email, phone, company, notes, status, totalPrice, id, id]
      )

      if (status === 'Approved') {
        const [rows] = await pool.execute(
          'SELECT * FROM quotes WHERE id = ? OR quote_number = ? LIMIT 1',
          [id, id]
        )
        if (rows.length > 0) {
          const q = rows[0]
          const [existingOrders] = await pool.execute(
            'SELECT id FROM orders WHERE notes LIKE ? LIMIT 1',
            [`%${q.quote_number}%`]
          )
          if (existingOrders.length === 0) {
            const year = new Date().getFullYear()
            const randomSeq = Math.floor(100000 + Math.random() * 900000)
            const orderNumber = `ONP-${year}-${randomSeq}`
            await pool.execute(
              `INSERT INTO orders 
                (order_number, user_id, customer_name, customer_email, customer_phone, company, status, subtotal, tax, shipping, total_price, currency, notes)
               VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, 0, 0, ?, 'AED', ?)`,
              [
                orderNumber,
                q.user_id || null,
                q.name,
                q.email,
                q.phone || null,
                q.company || null,
                q.total_price || 0,
                q.total_price || 0,
                q.notes ? `${q.notes} (Approved Quote ${q.quote_number})` : `Approved Quote ${q.quote_number}`,
              ]
            )
          }
        }
      }
    } catch {
      // MySQL unavailable
    }

    res.json({
      success: true,
      message: 'Quote updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

async function deleteQuote(req, res, next) {
  try {
    const { id } = req.params
    persistentStore.deleteQuote(id)

    try {
      await pool.execute('DELETE FROM quote_items WHERE quote_id = ?', [id])
      await pool.execute('DELETE FROM quotes WHERE id = ? OR quote_number = ?', [id, id])
    } catch {
      // MySQL unavailable
    }

    res.json({ success: true, message: 'Quote deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createQuote,
  listQuotes,
  getQuoteById,
  updateQuote,
  updateQuoteStatus,
  deleteQuote,
}
