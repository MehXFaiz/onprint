const express = require('express')
const {
  listReviews,
  createReview,
  voteHelpful,
  respondToReviewAction,
  updateReviewStatusAction,
} = require('../controllers/reviewController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/', listReviews)
router.post('/', createReview)
router.post('/:id/vote', voteHelpful)
router.post('/:id/reply', authenticateToken, requireAdmin, respondToReviewAction)
router.put('/:id/status', authenticateToken, requireAdmin, updateReviewStatusAction)

module.exports = router
