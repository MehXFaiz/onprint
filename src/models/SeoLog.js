const mongoose = require('mongoose')

const seoLogSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    event_type: { type: String, required: true, index: true },
    status: { type: String, default: 'info' },
    message: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoLog || mongoose.model('SeoLog', seoLogSchema)
