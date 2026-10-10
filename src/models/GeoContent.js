const mongoose = require('mongoose')

const geoContentSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    topic: { type: String, required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    target_keyword: { type: String, default: null },
    entity: { type: String, default: 'ONPRINT' },
    target_url: { type: String, default: null },
    related_service: { type: String, default: null },
    faq: { type: Boolean, default: true },
    source: { type: String, default: 'ONPRINT Pressroom Operations Manual' },
    author: { type: String, default: 'ONPRINT Technical Team' },
    status: { type: String, default: 'published', index: true },
    published_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.GeoContent || mongoose.model('GeoContent', geoContentSchema)
