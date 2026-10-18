const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')
const persistentStore = require('../data/persistentStore')
const { sendNotification } = require('../services/notificationService')

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

    // Check if customer is tracking a quote reference (e.g. ONP-Q-XXXXXX)
    const localQuote = persistentStore.getQuote(id)
    if (localQuote) {
      return res.json({
        success: true,
        data: {
          _id: `quote-${localQuote.id}`,
          id: localQuote.id,
          orderNumber: localQuote.quoteNumber,
          quoteNumber: localQuote.quoteNumber,
          isQuote: true,
          customerName: localQuote.name,
          customerEmail: localQuote.email,
          customerPhone: localQuote.phone,
          company: localQuote.company,
          status: localQuote.status || 'New',
          productName: localQuote.productName || localQuote.items?.[0]?.productName || 'Custom Print Job',
          quantity: localQuote.quantity || 1,
          specs: localQuote.specs || '',
          finishes: localQuote.finishes || [],
          deliveryLocation: localQuote.deliveryLocation || 'Dubai',
          notes: localQuote.notes || '',
          artworkFile: localQuote.artworkFile || localQuote.artworkFiles?.[0] || null,
          totalPrice: localQuote.totalPrice || localQuote.estimatedPrice || 0,
          currency: 'AED',
          createdAt: localQuote.createdAt,
          items: localQuote.items || [],
        },
      })
    }

    // Check if customer is tracking a corporate quote (e.g. ONP-CORP-XXXXXX)
    const localCorp = persistentStore.getCorporateQuote(id)
    if (localCorp) {
      return res.json({
        success: true,
        data: {
          _id: `corp-${localCorp.id}`,
          id: localCorp.id,
          orderNumber: localCorp.referenceNumber,
          isCorporate: true,
          customerName: localCorp.contactName,
          customerEmail: localCorp.email,
          customerPhone: localCorp.phone,
          company: localCorp.companyName,
          status: localCorp.status || 'New',
          productName: 'Corporate Print Procurement Package',
          quantity: localCorp.items?.length || 1,
          specs: `Corporate Account (${localCorp.creditTermsRequested || 'Prepaid'})`,
          notes: localCorp.notes || '',
          artworkFile: localCorp.artworkFiles?.[0] || null,
          totalPrice: 0,
          currency: 'AED',
          createdAt: localCorp.createdAt,
          items: localCorp.items || [],
        },
      })
    }

    throw new ApiError(404, 'Order or quote reference not found')
  } catch (err) {
    next(err)
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status, courierPartner, trackingNumber, proofUrl } = req.body

    if (!status) throw new ApiError(400, 'Status is required')

    const updated = persistentStore.updateOrderStatus(id, status)

    try {
      await pool.execute(
        'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ? OR order_number = ?',
        [status, id, id]
      )
    } catch {
      // MySQL unavailable
    }

    // Trigger customer notification for milestone
    const targetOrder = updated || persistentStore.getOrder(id)
    if (targetOrder?.customerEmail) {
      let eventType = null
      const s = status.toLowerCase()
      if (s.includes('proof')) eventType = 'proof_ready'
      else if (s.includes('approved')) eventType = 'artwork_approved'
      else if (s.includes('production') || s.includes('printing')) eventType = 'production_milestone'
      else if (s.includes('dispatch') || s.includes('out for delivery')) eventType = 'order_dispatched'
      else if (s.includes('deliver') || s.includes('complete')) eventType = 'order_delivered'

      if (eventType) {
        sendNotification({
          eventType,
          recipientEmail: targetOrder.customerEmail,
          recipientPhone: targetOrder.customerPhone,
          recipientName: targetOrder.customerName,
          referenceNumber: targetOrder.orderNumber,
          payload: {
            courierPartner,
            trackingNumber,
            proofUrl,
          },
        }).catch((e) => console.warn('[Order Notification] Failed:', e.message))
      }
    }

    res.json({ success: true, message: `Order status updated to ${status}` })
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

async function bulkDeleteOrders(req, res, next) {
  let connection = null
  try {
    const ids = req.body.ids || req.body.orderIds || []
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ApiError(400, 'Order IDs array is required for bulk deletion')
    }

    persistentStore.deleteOrders(ids)

    try {
      connection = await pool.getConnection()
      const placeholders = ids.map(() => '?').join(',')
      await connection.execute(`DELETE FROM order_items WHERE order_id IN (${placeholders})`, ids)
      await connection.execute(
        `DELETE FROM orders WHERE id IN (${placeholders}) OR order_number IN (${placeholders})`,
        [...ids, ...ids]
      )
    } catch {
      // offline/store fallback
    }

    res.json({
      success: true,
      message: `${ids.length} orders deleted successfully`,
      count: ids.length,
    })
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
  bulkDeleteOrders,
}
