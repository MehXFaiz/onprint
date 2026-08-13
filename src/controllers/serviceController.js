const ApiError = require('../utils/ApiError')
const { services } = require('../data/initialData')

async function listServices(req, res, next) {
  try {
    const list = services
      .filter((s) => s.active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name))
    res.json({ success: true, data: list })
  } catch (err) {
    next(err)
  }
}

async function getServiceBySlug(req, res, next) {
  try {
    const service = services.find((s) => s.slug === req.params.slug && s.active !== false)
    if (!service) throw new ApiError(404, 'Service not found')
    res.json({ success: true, data: service })
  } catch (err) {
    next(err)
  }
}

module.exports = { listServices, getServiceBySlug }
