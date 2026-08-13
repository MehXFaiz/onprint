function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500
  const isProduction = process.env.NODE_ENV === 'production'

  if (!isProduction) {
    console.error(err)
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && isProduction ? 'Something went wrong' : err.message,
  })
}

module.exports = { notFound, errorHandler }
