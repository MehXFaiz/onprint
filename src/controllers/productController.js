const ApiError = require('../utils/ApiError')
const Product = require('../models/Product')

const PAGE_SIZE = 12

async function listProducts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const filter = { active: true }

    if (req.query.category) {
      filter.category = req.query.category
    }
    if (req.query.featured === 'true') {
      filter.featured = true
    }
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' }
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort('-createdAt')
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE),
      Product.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: products,
      pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) || 1 },
    })
  } catch (err) {
    next(err)
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug, active: true }).populate('category', 'name slug')
    if (!product) throw new ApiError(404, 'Product not found')
    res.json({ success: true, data: product })
  } catch (err) {
    next(err)
  }
}

module.exports = { listProducts, getProductBySlug }
