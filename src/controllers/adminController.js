const { pool } = require('../config/database')
const { products: fallbackProducts, categories: fallbackCategories, services: fallbackServices } = require('../data/initialData')
const persistentStore = require('../data/persistentStore')

async function getAdminDashboardMetrics(req, res, next) {
  try {
    const { timeframe } = req.query

    let productStats = { total: 0, active: 0, inactive: 0 }
    let orderStats = {
      total: 0,
      pending: 0,
      inProduction: 0,
      processing: 0,
      dispatched: 0,
      delivered: 0,
      cancelled: 0,
    }
    let revenue = 0
    let quoteStats = { total: 0, pending: 0, approved: 0, rejected: 0 }
    let messageStats = { total: 0, unread: 0 }
    let userStats = { total: 0, customers: 0, admins: 0 }
    let serviceStats = { total: 0, active: 0 }
    let categoryStats = { total: fallbackCategories.length, active: fallbackCategories.length }
    let subscriberStats = { total: 0 }
    let recentOrders = []
    let recentQuotes = []
    let mysqlLoaded = false

    try {
      // 1. Products Metrics
      const [pRows] = await pool.execute('SELECT active, COUNT(*) AS count FROM products GROUP BY active')
      pRows.forEach((r) => {
        const cnt = Number(r.count)
        productStats.total += cnt
        if (r.active) productStats.active += cnt
        else productStats.inactive += cnt
      })

      // 2. Orders Metrics & Revenue
      const [oRows] = await pool.execute('SELECT status, total_price, created_at FROM orders')
      if (oRows.length > 0) {
        oRows.forEach((o) => {
          orderStats.total += 1
          const st = (o.status || '').toLowerCase()
          if (st.includes('pending')) orderStats.pending += 1
          else if (st.includes('production') || st.includes('press')) orderStats.inProduction += 1
          else if (st.includes('processing')) orderStats.processing += 1
          else if (st.includes('dispatch')) orderStats.dispatched += 1
          else if (st.includes('deliver') || st.includes('complete')) orderStats.delivered += 1
          else if (st.includes('cancel')) orderStats.cancelled += 1

          revenue += Number(o.total_price || 0)
        })
        mysqlLoaded = true
      }

      // 3. Quotes Metrics
      const [qRows] = await pool.execute('SELECT status, COUNT(*) AS count FROM quotes GROUP BY status')
      qRows.forEach((r) => {
        const cnt = Number(r.count)
        quoteStats.total += cnt
        const st = (r.status || '').toLowerCase()
        if (st.includes('pending')) quoteStats.pending += cnt
        else if (st.includes('approve')) quoteStats.approved += cnt
        else if (st.includes('reject')) quoteStats.rejected += cnt
      })

      // 4. Messages Metrics
      const [mRows] = await pool.execute('SELECT status, COUNT(*) AS count FROM contact_messages GROUP BY status')
      mRows.forEach((r) => {
        const cnt = Number(r.count)
        messageStats.total += cnt
        if (r.status === 'unread') messageStats.unread += cnt
      })

      // 5. Users Metrics
      const [uRows] = await pool.execute('SELECT role, COUNT(*) AS count FROM users GROUP BY role')
      uRows.forEach((r) => {
        const cnt = Number(r.count)
        userStats.total += cnt
        if (r.role === 'admin') userStats.admins += cnt
        else userStats.customers += cnt
      })

      // 6. Services Metrics
      const [sRows] = await pool.execute('SELECT active, COUNT(*) AS count FROM services GROUP BY active')
      sRows.forEach((r) => {
        const cnt = Number(r.count)
        serviceStats.total += cnt
        if (r.active) serviceStats.active += cnt
      })

      // 7. Subscribers Metrics
      const [subRows] = await pool.execute('SELECT COUNT(*) AS count FROM newsletter_subscribers')
      if (subRows.length > 0) subscriberStats.total = Number(subRows[0].count)

      // 8. Recent Orders
      const [roRows] = await pool.execute(
        `SELECT id, order_number AS orderNumber, customer_name AS customerName, company, total_price AS totalPrice, status, created_at AS createdAt 
         FROM orders ORDER BY created_at DESC LIMIT 5`
      )
      if (roRows.length > 0) {
        recentOrders = roRows.map((o) => ({ ...o, productName: 'Printing Order', totalPrice: Number(o.totalPrice) }))
      }

      // 9. Recent Quotes
      const [rqRows] = await pool.execute(
        `SELECT id, quote_number AS quoteNumber, name, email, company, total_price AS totalPrice, status, created_at AS createdAt 
         FROM quotes ORDER BY created_at DESC LIMIT 5`
      )
      if (rqRows.length > 0) {
        recentQuotes = rqRows.map((q) => ({ ...q, totalPrice: Number(q.totalPrice) }))
      }
      // 10. Categories Metrics
      const [cRows] = await pool.execute('SELECT active, COUNT(*) AS count FROM categories GROUP BY active')
      cRows.forEach((r) => {
        const cnt = Number(r.count)
        categoryStats.total += cnt
        if (r.active) categoryStats.active += cnt
      })
    } catch (err) {
      console.warn('[Admin Dashboard] MySQL query note:', err.message)
    }

    // Read live local persistent orders/quotes if MySQL had none
    if (!mysqlLoaded || orderStats.total === 0) {
      const storeOrders = persistentStore.getOrders()
      orderStats = {
        total: storeOrders.length,
        pending: storeOrders.filter((o) => (o.status || '').toLowerCase() === 'pending').length,
        inProduction: storeOrders.filter((o) => (o.status || '').toLowerCase().includes('production')).length,
        processing: storeOrders.filter((o) => (o.status || '').toLowerCase().includes('processing')).length,
        dispatched: storeOrders.filter((o) => (o.status || '').toLowerCase().includes('dispatch')).length,
        delivered: storeOrders.filter((o) => (o.status || '').toLowerCase().includes('deliver')).length,
        cancelled: storeOrders.filter((o) => (o.status || '').toLowerCase().includes('cancel')).length,
      }
      revenue = storeOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0)
      recentOrders = storeOrders.slice(0, 5)
    }

    if (quoteStats.total === 0) {
      const storeQuotes = persistentStore.getQuotes()
      quoteStats = {
        total: storeQuotes.length,
        pending: storeQuotes.filter((q) => (q.status || '').toLowerCase() === 'pending').length,
        approved: storeQuotes.filter((q) => (q.status || '').toLowerCase().includes('approve')).length,
        rejected: storeQuotes.filter((q) => (q.status || '').toLowerCase().includes('reject')).length,
      }
      recentQuotes = storeQuotes.slice(0, 5)
    }

    let recentMessages = []
    if (messageStats.total === 0) {
      const storeMessages = persistentStore.getMessages()
      messageStats = {
        total: storeMessages.length,
        unread: storeMessages.filter((m) => (m.status || '').toLowerCase() === 'unread').length,
      }
      recentMessages = storeMessages.slice(0, 5)
    }

    if (serviceStats.total === 0) {
      serviceStats.total = fallbackServices.length
      serviceStats.active = fallbackServices.length
    }
    if (userStats.total === 0) {
      userStats.total = 1
      userStats.admins = 1
    }

    res.json({
      success: true,
      data: {
        timeframe: timeframe || 'all',
        categories: { total: fallbackCategories.length, active: fallbackCategories.length },
        products: productStats,
        orders: orderStats,
        revenue,
        quotes: quoteStats,
        messages: messageStats,
        users: userStats,
        services: serviceStats,
        newsletterSubscribers: subscriberStats,
        recentOrders,
        recentQuotes,
        recentMessages,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAdminDashboardMetrics,
}
