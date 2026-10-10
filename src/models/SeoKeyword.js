const mongoose = require('mongoose')

const seoKeywordSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    keyword: { type: String, required: true, unique: true, trim: true },
    keyword_type: { type: String, default: 'primary' },
    search_intent: { type: String, default: 'Commercial' },
    cluster: { type: String, required: true, index: true },
    target_url: { type: String, default: null },
    target_page: { type: String, default: null },
    priority: { type: String, default: 'Medium' },
    status: { type: String, default: 'Planned', index: true },
    notes: { type: String, default: null },
    content_type: { type: String, default: null },
    assigned_page: { type: String, default: null },
    category: { type: String, default: null },
    country: { type: String, default: 'UAE' },
    city: { type: String, default: 'Dubai' },
    current_ranking: { type: Number, default: null },
    previous_ranking: { type: Number, default: null },
    search_volume: { type: Number, default: null },
    cpc: { type: Number, default: null },
    competition: { type: String, default: null },
    last_checked: { type: Date, default: null },
    ranking_change: { type: Number, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoKeyword || mongoose.model('SeoKeyword', seoKeywordSchema)
