const ApiError = require('../utils/ApiError')
const { products } = require('../data/initialData')

const PAGE_SIZE = 12

async function listProducts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    let filtered = products.filter((p) => p.active !== false)

    if (req.query.category) {
      const catQuery = String(req.query.category).toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.category &&
          (String(p.category._id).toLowerCase() === catQuery ||
            String(p.category.slug).toLowerCase() === catQuery),
      )
    }

    if (req.query.featured === 'true') {
      filtered = filtered.filter((p) => p.featured === true)
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i')
      filtered = filtered.filter((p) => searchRegex.test(p.name))
    }

    // Sort by createdAt descending
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const total = filtered.length
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    res.json({
      success: true,
      data: paginated,
      pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) || 1 },
    })
  } catch (err) {
    next(err)
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = products.find((p) => p.slug === req.params.slug && p.active !== false)
    if (!product) throw new ApiError(404, 'Product not found')
    res.json({ success: true, data: product })
  } catch (err) {
    next(err)
  }
}

module.exports = { listProducts, getProductBySlug }
