const { Review } = require('../models')
const persistentStore = require('../data/persistentStore')
const ApiError = require('../utils/ApiError')

async function listReviews(req, res, next) {
  try {
    const { product_slug, status } = req.query
    let reviews = []

    try {
      if (Review) {
        const filter = {}
        if (product_slug) {
          filter.$or = [{ product_slug }, { product_slug: null }]
        }
        if (status) {
          filter.status = status
        } else if (!req.user || req.user.role !== 'admin') {
          filter.status = 'approved'
        }

        const docs = await Review.find(filter).sort({ created_at: -1 }).lean()
        if (docs.length > 0) {
          reviews = docs.map((d) => ({
            id: d.id || d._id,
            _id: d._id,
            product_slug: d.product_slug,
            product_name: d.product_name,
            customer_name: d.customer_name,
            company: d.company,
            rating: d.rating,
            title: d.title,
            comment: d.comment,
            verified_purchase: d.verified_purchase,
            order_number: d.order_number,
            status: d.status,
            helpful_votes: d.helpful_votes || 0,
            staff_response: d.staff_response,
            created_at: d.created_at,
          }))
        }
      }
    } catch {
      // fallback
    }

    if (reviews.length === 0) {
      reviews = persistentStore.getReviews({
        product_slug,
        status: req.user?.role === 'admin' ? status : (status || 'approved'),
      })
    }

    // Compute aggregate metrics
    const totalCount = reviews.length
    const averageRating = totalCount > 0
      ? Math.round((reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / totalCount) * 10) / 10
      : 5.0
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)))
      ratingDistribution[star] = (ratingDistribution[star] || 0) + 1
    })

    res.json({
      success: true,
      data: reviews,
      metrics: {
        totalReviews: totalCount,
        averageRating,
        ratingDistribution,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function createReview(req, res, next) {
  try {
    const { product_slug, product_name, customer_name, company, rating, title, comment, order_number } = req.body

    if (!customer_name || !rating || !title || !comment) {
      throw new ApiError(400, 'Customer name, star rating (1-5), review title, and comments are required.')
    }

    const starRating = Math.min(5, Math.max(1, Number(rating) || 5))
    const isVerified = Boolean(order_number && String(order_number).trim().length > 3)

    const newReview = persistentStore.addReview({
      product_slug: product_slug || null,
      product_name: product_name || 'Commercial Print Work',
      customer_name: customer_name.trim(),
      company: company ? company.trim() : null,
      rating: starRating,
      title: title.trim(),
      comment: comment.trim(),
      verified_purchase: isVerified,
      order_number: order_number ? order_number.trim() : null,
    })

    try {
      if (Review) {
        await Review.create({
          product_slug: product_slug || null,
          product_name: product_name || 'Commercial Print Work',
          customer_name: customer_name.trim(),
          company: company ? company.trim() : null,
          rating: starRating,
          title: title.trim(),
          comment: comment.trim(),
          verified_purchase: isVerified,
          order_number: order_number ? order_number.trim() : null,
          status: 'approved',
        })
      }
    } catch {
      // fallback
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your verified review has been submitted successfully.',
      data: newReview,
    })
  } catch (err) {
    next(err)
  }
}

async function voteHelpful(req, res, next) {
  try {
    const { id } = req.params
    const updated = persistentStore.voteHelpfulReview(id)

    try {
      if (Review) {
        await Review.updateOne(
          { $or: [{ id }, { _id: id }] },
          { $inc: { helpful_votes: 1 } }
        )
      }
    } catch {
      // fallback
    }

    res.json({ success: true, message: 'Thank you for your feedback.', data: updated })
  } catch (err) {
    next(err)
  }
}

async function respondToReviewAction(req, res, next) {
  try {
    const { id } = req.params
    const { response, responder_name } = req.body
    if (!response) throw new ApiError(400, 'Response text is required')

    const responder = responder_name || 'ONPRINT Master Pressman'
    const updated = persistentStore.respondToReview(id, response, responder)

    try {
      if (Review) {
        await Review.updateOne(
          { $or: [{ id }, { _id: id }] },
          {
            $set: {
              staff_response: {
                response,
                responder_name: responder,
                responded_at: new Date(),
              },
            },
          }
        )
      }
    } catch {
      // fallback
    }

    res.json({ success: true, message: 'Staff response posted.', data: updated })
  } catch (err) {
    next(err)
  }
}

async function updateReviewStatusAction(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!status) throw new ApiError(400, 'Status is required')

    const updated = persistentStore.updateReviewStatus(id, status)
    try {
      if (Review) {
        await Review.updateOne(
          { $or: [{ id }, { _id: id }] },
          { $set: { status, updated_at: new Date() } }
        )
      }
    } catch {
      // fallback
    }

    res.json({ success: true, message: `Review status updated to ${status}`, data: updated })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listReviews,
  createReview,
  voteHelpful,
  respondToReviewAction,
  updateReviewStatusAction,
}
