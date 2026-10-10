const mongoose = require('mongoose')

const seoChangeSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    recommendation_id: { type: Number, default: null },
    entity_type: { type: String, required: true, index: true },
    entity_id: { type: Number, default: null },
    page_url: { type: String, required: true },
    change_type: { type: String, required: true },
    old_value: { type: mongoose.Schema.Types.Mixed, default: null },
    new_value: { type: mongoose.Schema.Types.Mixed, default: null },
    ai_reason: { type: String, default: null },
    ai_model: { type: String, default: 'gemini-2.5-flash' },
    approved_by: { type: String, default: 'Admin' },
    approved_at: { type: Date, default: null },
    applied_at: { type: Date, default: Date.now, index: true },
    status: { type: String, default: 'applied', enum: ['applied', 'rolled_back'], index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoChange || mongoose.model('SeoChange', seoChangeSchema)
