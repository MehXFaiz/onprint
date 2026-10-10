const mongoose = require('mongoose')

const seoPageMetricSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    page_url: { type: String, required: true, index: true },
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0.0 },
    position: { type: Number, default: 0.0 },
    snapshot_date: { type: Date, required: true, index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoPageMetric || mongoose.model('SeoPageMetric', seoPageMetricSchema)
