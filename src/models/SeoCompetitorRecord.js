const mongoose = require('mongoose')

const seoCompetitorRecordSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    competitor_name: { type: String, required: true, index: true },
    competitor_url: { type: String, default: null },
    record_type: { type: String, required: true, index: true },
    keyword: { type: String, default: null },
    source_url: { type: String, default: null },
    notes: { type: String, default: null },
    imported_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoCompetitorRecord || mongoose.model('SeoCompetitorRecord', seoCompetitorRecordSchema)
