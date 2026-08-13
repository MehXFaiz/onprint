const { categories } = require('../data/initialData')

async function listCategories(req, res, next) {
  try {
    const list = categories
      .filter((c) => c.active !== false)
      .sort((a, b) => a.name.localeCompare(b.name))
    res.json({ success: true, data: list })
  } catch (err) {
    next(err)
  }
}

module.exports = { listCategories }
