const mongoose = require('mongoose')

const seoAiVisibilitySchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    query: { type: String, required: true },
    cluster: { type: String, default: null, index: true },
    intent: { type: String, default: null },
    target_page: { type: String, default: null },
    target_url: { type: String, default: null },
    overall_visibility_score: { type: Number, default: 0 },
    status: { type: String, default: 'Dominant Citation', index: true },
    last_tested: { type: Date, default: null },
    engines_json: { type: String, default: null },
    key_entities_extracted: { type: String, default: null },
    recommended_action: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoAiVisibility || mongoose.model('SeoAiVisibility', seoAiVisibilitySchema)
