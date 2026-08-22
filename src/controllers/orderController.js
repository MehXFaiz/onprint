const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')
const persistentStore = require('../data/persistentStore')

async function createOrder(req, res, next) {
  let connection = null
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      company,
      items,
      subtotal,
      tax,
      shipping,
      totalPrice,
      notes,
      specs,
      artworkFile,
    } = req.body

    if (!customerName || !customerEmail) {
      throw new ApiError(400, 'Customer name and email are required')
    }

    const year = new Date().getFullYear()
    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const orderNumber = `ORD-${year}-${randomSeq}`
    const userId = req.user ? req.user.id : null

    const calcSubtotal = subtotal || (Array.isArray(items) ? items.reduce((sum, i) => sum + (i.subtotal || (i.price || i.unitPrice || 0) * (i.quantity || 1) || 0), 0) : 0)
    const calcTax = tax || 0
    const calcShipping = shipping || 0
    const calcTotal = totalPrice || calcSubtotal + calcTax + calcShipping

    // 1. Always persist to disk-backed persistentStore
    const createdLocalOrder = persistentStore.addOrder({
      orderNumber,
      userId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.toLowerCase().trim(),
      customerPhone: customerPhone || null,
      company: company || null,
      subtotal: calcSubtotal,
      tax: calcTax,
      shipping: calcShipping,
      totalPrice: calcTotal,
      notes: notes || null,
      specs: specs || null,
      artworkFile: artworkFile || null,
      items: Array.isArray(items) && items.length > 0 ? items : [
        {
          productName: req.body.productName || 'Printing Order',
          quantity: req.body.quantity || 1,
          unitPrice: calcTotal,
          subtotal: calcTotal,
        }
      ]
    })

    // 2. If MySQL is connected, insert into MySQL database
    let orderId = createdLocalOrder.id
    try {
      connection = await pool.getConnection()
      await connection.beginTransaction()

      const [result] = await connection.execute(
        `INSERT INTO orders 
          (order_number, user_id, customer_name, customer_email, customer_phone, company, status, subtotal, tax, shipping, total_price, currency, notes)
         VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, 'AED', ?)`,
        [
          orderNumber,
          userId,
          customerName.trim(),
          customerEmail.toLowerCase().trim(),
          customerPhone || null,
          company || null,
          calcSubtotal,
          calcTax,
          calcShipping,
          calcTotal,
          notes || null,
        ]
      )

      orderId = result.insertId

      if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const itemSubtotal = item.subtotal || (item.quantity || 1) * (item.unitPrice || item.price || 0)
          await connection.execute(
            `INSERT INTO order_items 
              (order_id, product_id, product_name, quantity, unit_price, subtotal)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              item.productId || null,
              item.productName || item.name || 'Printed Item',
              item.quantity || 1,
              item.unitPrice || item.price || 0,
              itemSubtotal,
            ]
          )
        }
      }

      await connection.commit()
    } catch (dbErr) {
      if (connection) await connection.rollback()
      console.warn('[Orders Controller] MySQL insert skipped, saved in persistent store:', dbErr.message)
    } finally {
      if (connection) connection.release()
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        id: orderId,
        orderNumber,
        status: 'Pending',
        totalPrice: calcTotal,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function listOrders(req, res, next) {
  try {
    let orders = []
    let mysqlLoaded = false

    try {
      let query = 'SELECT * FROM orders ORDER BY created_at DESC'
      let params = []

      if (req.user && req.user.role !== 'admin') {
        query = 'SELECT * FROM orders WHERE user_id = ? OR customer_email = ? ORDER BY created_at DESC'
        params = [req.user.id, req.user.email]
      }

      const [rows] = await pool.execute(query, params)

      if (rows.length > 0) {
        const [items] = await pool.execute('SELECT * FROM order_items')

        const itemMap = {}
        items.forEach((item) => {
          if (!itemMap[item.order_id]) itemMap[item.order_id] = []
          itemMap[item.order_id].push({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            quantity: item.quantity,
            unitPrice: Number(item.unit_price),
            subtotal: Number(item.subtotal),
          })
        })

        orders = rows.map((o) => ({
          _id: `ord-${o.id}`,
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          customerPhone: o.customer_phone,
          company: o.company,
          status: o.status,
          subtotal: Number(o.subtotal || o.total_price || 0),
          tax: Number(o.tax || 0),
          shipping: Number(o.shipping || 0),
          totalPrice: Number(o.total_price || o.total_amount || 0),
          currency: o.currency || 'AED',
          notes: o.notes,
          createdAt: o.created_at,
          productName: itemMap[o.id]?.[0]?.productName || 'Printing Order',
          items: itemMap[o.id] || [],
        }))
        mysqlLoaded = true
      }
    } catch {
      // MySQL unavailable
    }

    if (!mysqlLoaded) {
      orders = persistentStore.getOrders()
      if (req.user && req.user.role !== 'admin') {
        orders = orders.filter((o) => o.userId === req.user.id || (o.customerEmail && o.customerEmail.toLowerCase() === req.user.email?.toLowerCase()))
      }
    }

    res.json({
      success: true,
      data: orders,
    })
  } catch (err) {
    next(err)
  }
}

async function getOrderById(req, res, next) {
  try {
    const { id } = req.params

    try {
      const [rows] = await pool.execute(
        'SELECT * FROM orders WHERE id = ? OR order_number = ? LIMIT 1',
        [id, id]
      )

      if (rows.length > 0) {
        const o = rows[0]
        const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [o.id])

        return res.json({
          success: true,
          data: {
            _id: `ord-${o.id}`,
            id: o.id,
            orderNumber: o.order_number,
            customerName: o.customer_name,
            customerEmail: o.customer_email,
            customerPhone: o.customer_phone,
            company: o.company,
            status: o.status,
            subtotal: Number(o.subtotal || 0),
            tax: Number(o.tax || 0),
            shipping: Number(o.shipping || 0),
            totalPrice: Number(o.total_price || 0),
            currency: o.currency || 'AED',
            notes: o.notes,
            createdAt: o.created_at,
            items: items.map((i) => ({
              id: i.id,
              productId: i.product_id,
              productName: i.product_name,
              quantity: i.quantity,
              unitPrice: Number(i.unit_price),
              subtotal: Number(i.subtotal),
            })),
          },
        })
      }
    } catch {
      // MySQL unavailable
    }

    const localOrder = persistentStore.getOrder(id)
    if (localOrder) {
      return res.json({
        success: true,
        data: localOrder,
      })
    }

    throw new ApiError(404, 'Order not found')
  } catch (err) {
    next(err)
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) throw new ApiError(400, 'Status is required')

    persistentStore.updateOrderStatus(id, status)

    try {
      await pool.execute(
        'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ? OR order_number = ?',
        [status, id, id]
      )
    } catch {
      // MySQL unavailable
    }

    res.json({ success: true, message: 'Order status updated successfully' })
  } catch (err) {
    next(err)
  }
}

async function deleteOrder(req, res, next) {
  let connection = null
  try {
    const { id } = req.params
    persistentStore.deleteOrder(id)

    try {
      connection = await pool.getConnection()
      await connection.execute('DELETE FROM order_items WHERE order_id = ?', [id])
      await connection.execute('DELETE FROM orders WHERE id = ? OR order_number = ?', [id, id])
    } catch {
      // offline/store fallback
    }

    res.json({ success: true, message: 'Order deleted successfully' })
  } catch (err) {
    next(err)
  } finally {
    if (connection) connection.release()
  }
}

module.exports = {
  createOrder,
  listOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
}
