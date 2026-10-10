const mongoose = require('mongoose')

const seoConversionSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    conversion_type: { type: String, required: true, index: true },
    landing_page: { type: String, default: null, index: true },
    referrer: { type: String, default: null },
    source_label: { type: String, default: null },
    query_string: { type: String, default: null },
    ip_hash: { type: String, default: null },
    user_agent: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoConversion || mongoose.model('SeoConversion', seoConversionSchema)
