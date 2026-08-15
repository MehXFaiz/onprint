const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')

async function createOrder(req, res, next) {
  const connection = await pool.getConnection()
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
    } = req.body

    if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, 'Customer details and at least one order item are required')
    }

    await connection.beginTransaction()

    const year = new Date().getFullYear()
    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const orderNumber = `ORD-${year}-${randomSeq}`

    const userId = req.user ? req.user.id : null

    const calcSubtotal = subtotal || items.reduce((sum, i) => sum + (i.subtotal || i.price * i.quantity || 0), 0)
    const calcTax = tax || 0
    const calcShipping = shipping || 0
    const calcTotal = totalPrice || calcSubtotal + calcTax + calcShipping

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

    const orderId = result.insertId

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

    await connection.commit()

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
    await connection.rollback()
    next(err)
  } finally {
    connection.release()
  }
}

async function listOrders(req, res, next) {
  try {
    let orders = []
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
          subtotal: Number(o.subtotal),
          tax: Number(o.tax),
          shipping: Number(o.shipping),
          totalPrice: Number(o.total_price),
          currency: o.currency,
          notes: o.notes,
          createdAt: o.created_at,
          productName: itemMap[o.id]?.[0]?.productName || 'Printing Order',
          items: itemMap[o.id] || [],
        }))
      }
    } catch {
      // Fallback
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

    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? OR order_number = ? LIMIT 1',
      [id, id]
    )

    if (rows.length === 0) {
      throw new ApiError(404, 'Order not found')
    }

    const o = rows[0]
    const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [o.id])

    res.json({
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
        subtotal: Number(o.subtotal),
        tax: Number(o.tax),
        shipping: Number(o.shipping),
        totalPrice: Number(o.total_price),
        currency: o.currency,
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
  } catch (err) {
    next(err)
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) throw new ApiError(400, 'Status is required')

    const [result] = await pool.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ? OR order_number = ?',
      [status, id, id]
    )

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'Order not found')
    }

    res.json({ success: true, message: 'Order status updated successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createOrder,
  listOrders,
  getOrderById,
  updateOrderStatus,
}
