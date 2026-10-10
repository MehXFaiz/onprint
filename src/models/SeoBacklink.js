const mongoose = require('mongoose')

const seoBacklinkSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    linking_domain: { type: String, required: true, index: true },
    linking_url: { type: String, required: true },
    target_url: { type: String, required: true },
    anchor_text: { type: String, default: null },
    link_type: { type: String, default: 'unknown' },
    status: { type: String, default: 'needs_review', index: true },
    authority: { type: Number, default: null },
    relevance: { type: String, default: 'unknown' },
    toxic_risk: { type: String, default: 'unknown' },
    first_discovered_at: { type: Date, default: null },
    last_checked_at: { type: Date, default: null },
    notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoBacklink || mongoose.model('SeoBacklink', seoBacklinkSchema)
