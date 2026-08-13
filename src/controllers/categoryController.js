const Category = require('../models/Category')

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find({ active: true }).sort('name')
    res.json({ success: true, data: categories })
  } catch (err) {
    next(err)
  }
}

module.exports = { listCategories }
