const ApiError = require('../utils/ApiError')
const Service = require('../models/Service')

async function listServices(req, res, next) {
  try {
    const services = await Service.find({ active: true }).sort('order name').populate('category', 'name slug')
    res.json({ success: true, data: services })
  } catch (err) {
    next(err)
  }
}

async function getServiceBySlug(req, res, next) {
  try {
    const service = await Service.findOne({ slug: req.params.slug, active: true }).populate('category', 'name slug')
    if (!service) throw new ApiError(404, 'Service not found')
    res.json({ success: true, data: service })
  } catch (err) {
    next(err)
  }
}

module.exports = { listServices, getServiceBySlug }
