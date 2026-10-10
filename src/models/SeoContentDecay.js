const mongoose = require('mongoose')

const seoContentDecaySchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    page_url: { type: String, required: true, index: true },
    title: { type: String, required: true },
    page_type: { type: String, default: 'service' },
    previous_clicks: { type: Number, default: 0 },
    current_clicks: { type: Number, default: 0 },
    clicks_change_pct: { type: Number, default: 0.0 },
    previous_impressions: { type: Number, default: 0 },
    current_impressions: { type: Number, default: 0 },
    impressions_change_pct: { type: Number, default: 0.0 },
    decay_severity: { type: String, default: 'MEDIUM', index: true },
    recommended_action: { type: String, default: null },
    status: { type: String, default: 'needs_refresh', index: true },
    last_audited: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoContentDecay || mongoose.model('SeoContentDecay', seoContentDecaySchema)
