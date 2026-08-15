const { pool } = require('../config/database')

function getDateWhereClause(timeframe, alias = '') {
  const prefix = alias ? `${alias}.` : ''
  switch (timeframe) {
    case 'today':
      return `${prefix}created_at >= CURDATE()`
    case '7days':
      return `${prefix}created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
    case '30days':
      return `${prefix}created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    case 'this_month':
      return `${prefix}created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')`
    case 'this_year':
      return `${prefix}created_at >= DATE_FORMAT(NOW(), '%Y-01-01')`
    default:
      return '1=1'
  }
}

async function getDashboardStats(req, res, next) {
  try {
    const timeframe = (req.query.timeframe || 'all').toLowerCase()
    const dateClause = getDateWhereClause(timeframe)

    const [
      productsResult,
      categoriesResult,
      servicesResult,
      usersResult,
      ordersResult,
      revenueResult,
      quotesResult,
      messagesResult,
      subscribersResult,
      recentOrdersResult,
      recentQuotesResult,
      recentMessagesResult,
      recentUsersResult,
      monthlyStatsResult,
    ] = await Promise.all([
      // 1. Products
      pool
        .execute(
          `SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) AS activeCount,
            SUM(CASE WHEN active = 0 THEN 1 ELSE 0 END) AS inactiveCount
          FROM products WHERE ${dateClause}`
        )
        .then(([r]) => r[0])
        .catch(() => ({ total: 0, activeCount: 0, inactiveCount: 0 })),

      // 2. Categories
      pool
        .execute(`SELECT COUNT(*) AS total FROM categories WHERE ${dateClause}`)
        .then(([r]) => r[0])
        .catch(() => ({ total: 0 })),

      // 3. Services
      pool
        .execute(
          `SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) AS activeCount
          FROM services WHERE ${dateClause}`
        )
        .then(([r]) => r[0])
        .catch(() => ({ total: 0, activeCount: 0 })),

      // 4. Users
      pool
        .execute(
          `SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN role = 'customer' THEN 1 ELSE 0 END) AS customerCount,
            SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS adminCount
          FROM users WHERE ${dateClause}`
        )
        .then(([r]) => r[0])
        .catch(() => ({ total: 0, customerCount: 0, adminCount: 0 })),

      // 5. Orders
      pool
        .execute(
          `SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN LOWER(status) = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
            SUM(CASE WHEN LOWER(status) = 'in production' THEN 1 ELSE 0 END) AS inProductionCount,
            SUM(CASE WHEN LOWER(status) = 'processing' THEN 1 ELSE 0 END) AS processingCount,
            SUM(CASE WHEN LOWER(status) = 'dispatched' THEN 1 ELSE 0 END) AS dispatchedCount,
            SUM(CASE WHEN LOWER(status) = 'delivered' THEN 1 ELSE 0 END) AS deliveredCount,
            SUM(CASE WHEN LOWER(status) = 'cancelled' THEN 1 ELSE 0 END) AS cancelledCount
          FROM orders WHERE ${dateClause}`
        )
        .then(([r]) => r[0])
        .catch(() => ({
          total: 0,
          pendingCount: 0,
          inProductionCount: 0,
          processingCount: 0,
          dispatchedCount: 0,
          deliveredCount: 0,
          cancelledCount: 0,
        })),

      // 6. Revenue
      pool
        .execute(
          `SELECT COALESCE(SUM(total_price), 0) AS totalRevenue
          FROM orders
          WHERE LOWER(status) NOT IN ('cancelled') AND ${dateClause}`
        )
        .then(([r]) => Number(r[0]?.totalRevenue || 0))
        .catch(() => 0),

      // 7. Quotes
      pool
        .execute(
          `SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN LOWER(status) = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
            SUM(CASE WHEN LOWER(status) = 'approved' THEN 1 ELSE 0 END) AS approvedCount,
            SUM(CASE WHEN LOWER(status) = 'rejected' THEN 1 ELSE 0 END) AS rejectedCount
          FROM quotes WHERE ${dateClause}`
        )
        .then(([r]) => r[0])
        .catch(() => ({ total: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0 })),

      // 8. Contact Messages
      pool
        .execute(
          `SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN LOWER(status) = 'unread' THEN 1 ELSE 0 END) AS unreadCount
          FROM contact_messages WHERE ${dateClause}`
        )
        .then(([r]) => r[0])
        .catch(() => ({ total: 0, unreadCount: 0 })),

      // 9. Newsletter Subscribers
      pool
        .execute(`SELECT COUNT(*) AS total FROM newsletter_subscribers WHERE ${dateClause}`)
        .then(([r]) => r[0])
        .catch(() => ({ total: 0 })),

      // 10. Recent Orders (limit 5)
      pool
        .execute(
          `SELECT 
            o.id,
            o.order_number AS orderNumber,
            o.customer_name AS customerName,
            o.customer_email AS customerEmail,
            o.company,
            o.status,
            o.total_price AS totalPrice,
            o.created_at AS createdAt,
            COALESCE((SELECT product_name FROM order_items WHERE order_id = o.id LIMIT 1), 'Print Order') AS productName
          FROM orders o
          ORDER BY o.created_at DESC
          LIMIT 5`
        )
        .then(([r]) => r.map((o) => ({ ...o, totalPrice: Number(o.totalPrice || 0) })))
        .catch(() => []),

      // 11. Recent Quotes (limit 5)
      pool
        .execute(
          `SELECT 
            id,
            quote_number AS quoteNumber,
            name,
            email,
            company,
            status,
            total_price AS totalPrice,
            created_at AS createdAt
          FROM quotes
          ORDER BY created_at DESC
          LIMIT 5`
        )
        .then(([r]) => r.map((q) => ({ ...q, totalPrice: Number(q.totalPrice || 0) })))
        .catch(() => []),

      // 12. Recent Messages (limit 5)
      pool
        .execute(
          `SELECT 
            id,
            name,
            email,
            subject,
            status,
            created_at AS createdAt
          FROM contact_messages
          ORDER BY created_at DESC
          LIMIT 5`
        )
        .then(([r]) => r)
        .catch(() => []),

      // 13. Recent Users (limit 5)
      pool
        .execute(
          `SELECT 
            id,
            name,
            email,
            role,
            status,
            created_at AS createdAt
          FROM users
          ORDER BY created_at DESC
          LIMIT 5`
        )
        .then(([r]) => r)
        .catch(() => []),

      // 14. Monthly Stats (last 6 months)
      pool
        .execute(
          `SELECT 
            DATE_FORMAT(created_at, '%b %Y') AS monthLabel,
            DATE_FORMAT(created_at, '%Y-%m') AS monthKey,
            COUNT(*) AS ordersCount,
            COALESCE(SUM(total_price), 0) AS revenue
          FROM orders
          WHERE LOWER(status) NOT IN ('cancelled')
          GROUP BY monthKey, monthLabel
          ORDER BY monthKey DESC
          LIMIT 6`
        )
        .then(([r]) => r.map((m) => ({ ...m, revenue: Number(m.revenue || 0) })))
        .catch(() => []),
    ])

    res.json({
      success: true,
      data: {
        timeframe,
        products: {
          total: Number(productsResult?.total || 0),
          active: Number(productsResult?.activeCount || 0),
          inactive: Number(productsResult?.inactiveCount || 0),
        },
        categories: {
          total: Number(categoriesResult?.total || 0),
        },
        services: {
          total: Number(servicesResult?.total || 0),
          active: Number(servicesResult?.activeCount || 0),
        },
        users: {
          total: Number(usersResult?.total || 0),
          customers: Number(usersResult?.customerCount || 0),
          admins: Number(usersResult?.adminCount || 0),
        },
        orders: {
          total: Number(ordersResult?.total || 0),
          pending: Number(ordersResult?.pendingCount || 0),
          inProduction: Number(ordersResult?.inProductionCount || 0),
          processing: Number(ordersResult?.processingCount || 0),
          dispatched: Number(ordersResult?.dispatchedCount || 0),
          delivered: Number(ordersResult?.deliveredCount || 0),
          cancelled: Number(ordersResult?.cancelledCount || 0),
        },
        revenue: revenueResult,
        quotes: {
          total: Number(quotesResult?.total || 0),
          pending: Number(quotesResult?.pendingCount || 0),
          approved: Number(quotesResult?.approvedCount || 0),
          rejected: Number(quotesResult?.rejectedCount || 0),
        },
        messages: {
          total: Number(messagesResult?.total || 0),
          unread: Number(messagesResult?.unreadCount || 0),
        },
        newsletterSubscribers: {
          total: Number(subscribersResult?.total || 0),
        },
        recentOrders: recentOrdersResult,
        recentQuotes: recentQuotesResult,
        recentMessages: recentMessagesResult,
        recentUsers: recentUsersResult,
        monthlyStats: monthlyStatsResult,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getDashboardStats,
}
