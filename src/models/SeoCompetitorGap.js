const mongoose = require('mongoose')

const seoCompetitorGapSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    competitor_url: { type: String, required: true },
    competitor_topic: { type: String, required: true },
    onprint_url: { type: String, required: true },
    missing_topic: { type: String, required: true },
    keyword_opportunity: { type: String, required: true, index: true },
    search_intent: { type: String, default: 'Commercial' },
    recommended_content: { type: String, default: null },
    internal_link_opportunity: { type: String, default: null },
    geo_opportunity: { type: String, default: null },
    priority: { type: String, default: 'Medium', index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoCompetitorGap || mongoose.model('SeoCompetitorGap', seoCompetitorGapSchema)
