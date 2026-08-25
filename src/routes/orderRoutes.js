const express = require('express')
const {
  createOrder,
  listOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  bulkDeleteOrders,
} = require('../controllers/orderController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.post('/', createOrder)
router.get('/', listOrders)
router.post('/bulk-delete', bulkDeleteOrders)
router.delete('/bulk', bulkDeleteOrders)
router.get('/:id', getOrderById)
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus)
router.delete('/:id', deleteOrder)

module.exports = router
