const express = require('express')
const {
  submitContact,
  listContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} = require('../controllers/contactController')

const router = express.Router()

router.post('/', submitContact)
router.get('/', listContactMessages)
router.put('/:id/status', updateContactMessageStatus)
router.delete('/:id', deleteContactMessage)

module.exports = router
