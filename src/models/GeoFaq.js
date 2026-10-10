const mongoose = require('mongoose')

const geoFaqSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true, index: true },
    related_service: { type: String, default: null },
    related_keyword: { type: String, default: null },
    target_url: { type: String, default: null },
    search_intent: { type: String, default: 'Commercial' },
    status: { type: String, default: 'published', index: true },
    published_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.GeoFaq || mongoose.model('GeoFaq', geoFaqSchema)
