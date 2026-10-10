const mongoose = require('mongoose')

const seoRecommendationSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    page_url: { type: String, required: true },
    entity_type: { type: String, default: 'page', index: true },
    entity_id: { type: Number, default: null },
    target_type: { type: String, default: null },
    target_field: { type: String, default: null },
    target_name: { type: String, default: null },
    target_url: { type: String, default: null },
    issue: { type: String, required: true },
    priority: { type: String, default: 'MEDIUM', index: true },
    status: { type: String, default: 'NEW', index: true },
    current_value: { type: mongoose.Schema.Types.Mixed, default: null },
    proposed_value: { type: mongoose.Schema.Types.Mixed, default: null },
    recommended_value: { type: String, default: null },
    reason: { type: String, default: null },
    expected_benefit: { type: String, default: null },
    confidence: { type: Number, default: 0.85 },
    keywords: { type: mongoose.Schema.Types.Mixed, default: null },
    internal_link_suggestions: { type: mongoose.Schema.Types.Mixed, default: null },
    reviewed_at: { type: Date, default: null },
    applied_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoRecommendation || mongoose.model('SeoRecommendation', seoRecommendationSchema)
