const mongoose = require('mongoose')

const seoKeywordSnapshotSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    query: { type: String, required: true, index: true },
    page_url: { type: String, default: null },
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0.0 },
    position: { type: Number, default: 0.0 },
    previous_position: { type: Number, default: null },
    opportunity_type: { type: String, default: null, index: true },
    snapshot_date: { type: Date, required: true, index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoKeywordSnapshot || mongoose.model('SeoKeywordSnapshot', seoKeywordSnapshotSchema)
