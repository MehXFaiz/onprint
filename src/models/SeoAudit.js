const mongoose = require('mongoose')

const seoAuditSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    health_score: { type: Number, default: 0 },
    technical_score: { type: Number, default: 0 },
    onpage_score: { type: Number, default: 0 },
    content_score: { type: Number, default: 0 },
    structured_data_score: { type: Number, default: 0 },
    total_pages_scanned: { type: Number, default: 0 },
    issues_count: { type: Number, default: 0 },
    summary_json: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoAudit || mongoose.model('SeoAudit', seoAuditSchema)
